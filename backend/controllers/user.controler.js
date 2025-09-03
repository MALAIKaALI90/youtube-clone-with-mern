
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponce.js";
import { verifyJwt } from "../middlewares/isLoggedIn.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

const generateAccessAndRegreshToken = async (userId) => {
  try {
const user = await User.findById(userId)
    if (!user) {
  throw new ApiError(404, "User not found when generating tokens");
}
    console.log(user);

    const AccessToken = user.generateAccessToken()
    const RefreshToken = user.generateRefreshToken()
    console.log(AccessToken);

    user.RefreshToken = RefreshToken

     await user.save({ validateBeforeSave: false })
    return { AccessToken, RefreshToken }


  }

  catch (error) {
    throw new ApiError(500, "something went wrong in server")
  }



}
const registerUser = asyncHandler(async (req, res) => {

  // res.status(400).json({
  //     message:"malaika khan making app"
  // })

  //for user register step  get user detail from frontend
  //validation is not empty
  //check if user already register
  //files hai ya ni e g images and avatar
  //upload the file in cloudnary
  // CHAECK AVATAR HAS OR NOT
  //create user obbject
  //creat entry in db
  //remove password and refresh token field
  //check user come or not 
  // if user exist then res return otherwise send error
  //STEP USESR DETAIL FROM FRONTEND
  const { username, email, fulname, password } = req.body
  //2ND STEP USER VALIDATION
  if ([fulname, username, email, password].some((field) =>
    field?.trim() === "")) {
    throw new ApiError(400, "ALL FIELDS ARE REQUIRED")

  }

  //3RD SSTEP IF USER  ALREDY RIGISTER OR NOT
  const existedUser = await User.findOne({
    $or: [{
      username
    }, { email }]
  })
  if (existedUser) {
    throw new ApiError(409, "user with email or username already exists")

  }
  // STEP 4 files hai ya ni e g images and avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar Local  file is require")

  }
    if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage Local  file is require")

  }
  //4STEP upload the file in cloudnary
  const avatar = await uplaodOnCloudinary(avatarLocalPath)
  const coverImage = await uplaodOnCloudinary(coverImageLocalPath)

  //5 STEP  CHAECK AVATAR HAS OR NOT
  if (!avatar) {
    throw new ApiError(400, "Avatar file is require")

  }
    if (!coverImage) {
    throw new ApiError(400, "Cover file is require")

  }
  //STEP 6 ,7create user obbject,entry in db

  const user = await User.create({
    username: username.toLowerCase(),
    fulname,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password

  })

  //check userbna h ya ni and 
  // STEP 8 remove password and refresh token field
  const createdUser = await User.findById(user._id).select(
    "-password  -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while register the user");


  }
  //return res

  return res.status(201).json(
    new ApiResponse(200, "user creates succesfully", user)
  )


})
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body



  if (!email && !password) {
    throw new ApiError(401, "email and password is required")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(406, "email  not match")


  }

  const passwordVerfied = await user.isPasswordCorrect(password);
  console.log(passwordVerfied);


  if (!passwordVerfied) {
    throw new ApiError(403, " password not match")


  }
  const { AccessToken, RefreshToken } = await generateAccessAndRegreshToken(user._id)

  const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }
  return res.status(200).cookie("AccessToken", AccessToken, options).cookie("RefreshToken", RefreshToken, options)
    .json(
      new ApiResponse(200,
        {
          user: loggedInUser,
          AccessToken,
          RefreshToken
        },
        "user logged in successfully "
      )
    )


})
const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $set: { RefreshToken: undefined }
  }, { new: true })
  const options = {
    httpOnlu: true,
    secure: true
  }
  return res.status(200).clearCookie("AccessToken", options).clearCookie("RefreshToken", options)
    .json(new ApiResponse(200, {}, "User logout successfully")
    )

})

//change  user its own password
const userNewPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);


  const verifyOldPassword = await user.isPasswordCorrect(oldPassword);

  if (!verifyOldPassword) {
    throw new Error(401, "your password is not coorect");


  }
  user.password = newPassword;
  user.save({ validateBeforeSave: false })
  return res.status(200).json(new ApiResponse(200,  "your password is changed now",{}))

})
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200,  "Current user is here",user
  ));
});
const updateUserDetail = asyncHandler(async (req, res) => {
  const { username, email } = req.body
  if (!username || !email) {
    throw new Error(401, "all filed are required");

  }
  const user =  await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        username,
        email
      }
    },
    { new: true }
  ).select("-password")
  return res.status(200).json(new ApiResponse(200,  "account details are modified",user))
})
const UpdateAvatarFile = asyncHandler(async (req, res) => {

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(402, "avatar file is not found")

  }
  const avatar = await uplaodOnCloudinary(avatarLocalPath)
  if (!avatar.url) {
    throw new ApiError(402, "avatar file is not uploading")


  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password")
  return res.status(200).json(
    new ApiResponse(200, "avatar image is edit", user)
  )
})
const UpdateCoverFile = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new Error(401, "cover image is not found");


  }
  const coverImage = await uplaodOnCloudinary(coverImageLocalPath)
  if (!coverImage) {
    throw new ApiError(402, "cover file is not uploading")
  }
  const user = await User.findByIdAndUpdate(req.user?._id, {

   $set: {
  coverImage: coverImage?.url  
}
  },
    { new: true }
  ).select("-password")
  return res.status(200).json(
    new ApiResponse(200, "cover image is edit", user)
  )

})
const getUserProfileSubscribtion = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(401, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribersToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        subscribersCount: 1,
        subscribersToCount: 1,
        avatar: 1,
        coverImage: 1,
        isSubscribed: 1
      }
    }
  ]);

  res.status(200).json(channel[0]);
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id:  new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "user",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {

                    fulname: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          }, {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }

          }
        ]

      }
    }

  ])

return res.status(200).json(
  new ApiResponse(200,user[0].watchHistory,"user watch history get")
)
})



export { registerUser, loginUser, logoutUser, userNewPassword, currentUser, updateUserDetail, UpdateAvatarFile, UpdateCoverFile, getUserProfileSubscribtion, getUserWatchHistory }