
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uplaodOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponce.js";
import { verifyJwt } from "../middlewares/isLoggedIn.js";
import { Subscription } from "../models/subscription.model.js";

const generateAccessAndRegreshToken = async (userId) => {
  try {

    const user = await User.findById(userId)
    console.log(user);

    const AccessToken = user.generateAccessToken()
    const RefreshToken = user.generateRefreshToken()
    console.log(AccessToken);

    user.RefreshToken = RefreshToken

    user.save({ validateBeforeSave: false })
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
    throw new ApiError(400, "Avatar file is require")

  }
  //4STEP upload the file in cloudnary
  const avatar = await uplaodOnCloudinary(avatarLocalPath)
  const coverImage = await uplaodOnCloudinary(coverImageLocalPath)

  //5 STEP  CHAECK AVATAR HAS OR NOT
  if (!avatar) {
    throw new ApiError(400, "Avatar file is require")

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

  console.log(req.body);

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
  return res.status(404).cookie("AccessToken", AccessToken, options).cookie("RefreshToken", RefreshToken, options)
    .json(
      new ApiError(200,
        {
          user: loggedInUser
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
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const verifyOldPassword = await user.isPasswordCorrect(oldPassword);

  if (!verifyOldPassword) {
    throw new Error(401, "your password is not coorect");


  }
  user.oldPassword = newPassword;
  user.save({ validateBeforeSave: false })
  return res.status(200).json(new ApiResponse(200, {}, "your password is changed now"))

})
const currentUser = asyncHandler(async (req, res) => {
  return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user is here"))
})
const updateUserDetail = asyncHandler(async (req, res) => {
  const { username, email } = req.body
  if (!username || !email) {
    throw new Error(401, "all filed are required");

  }
  const user = User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        username,
        email
      }
    },
    { new: true }
  ).select("-password")
  return res.status(200).json(new ApiResponse(200, user, "account details are modified"))
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
    new ApiResponse(200, user, "avatar image is edit")
  )
})
const UpdateCoverFile = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new Error(401, "cover image is not found");


  }
  const covereImage = await uplaodOnCloudinary(coverImageLocalPath)
  if (!covereImage) {
    throw new ApiError(402, "cover file is not uploading")
  }
  const user = await User.findByIdAndUpdate(req.user?._id, {

    $set: {
      covereImage: covereImage.url
    }
  },
    { new: true }
  ).select("-password")
  return res.status(200).json(
    new ApiResponse(200, user, "cover image is edit")
  )

})
const getUserProfileSubscribtion = asyncHandler(async (req, res) => {
  const { username } = req.prams;
  if (!username) {
    throw new Error(401, "username is missing");
    const channel = await User.aggregate([
      {
        $match: {
          username: username?.toLowerCase()
        },
      {
        $lookup: {
          from: "C",
          localfield: "._id",
          foreignField: "channel",
          as: "subscribers"



        },
      {
        $lookup: {
          from: "Subscription",
          localField: "._id",
          foreignField: "subscriber",
          as: "subscribedTo"
        },
        {
        $addFields: {
          subscribersCount: {
            $size: "$subscribers"
          },
          subscribersToCount: {
            $size: "$subscribedTo"
          },

        },

      },
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
      fulname: 1,
      username: 1,
      email: 1,
      subscribersCount: 1,
      subscribersToCount: 1,
      avatar: 1,
      coverImage: 1,
      isSubscribed: 1
    }
  }
      }
    ])
    if (!channel.length) {
      throw new Error(402,"channel does not exist");
      
      
    }
    return res.status(200).json(
      new ApiResponse(200,channel[0],"user channel fetched successfully")
    )

    
    
  }

  
});
export { registerUser, loginUser, logoutUser, userNewPassword, currentUser, updateUserDetail, UpdateAvatarFile, UpdateCoverFile, getUserProfileSubscribtion }