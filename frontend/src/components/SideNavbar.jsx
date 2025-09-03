import { Home, Compass, PlaySquare, Clock, ThumbsUp, ListVideo, User, ChevronRight } from "lucide-react";

export default function Sidebar({ Sidebar }) {
  return (
    <>
      {Sidebar && (
        <aside className="w-60 fixed top-14 left-0 h-[calc(100vh-56px)] bg-white shadow-md border-r border-gray-200 p-3">
          <nav className="flex flex-col gap-2">
            {/* Home */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Home className="w-5 h-5" />
              <span className="text-sm">Home</span>
            </div>

            {/* Shorts */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Compass className="w-5 h-5" />
              <span className="text-sm">Shorts</span>
            </div>

            {/* Subscriptions */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <PlaySquare className="w-5 h-5" />
              <span className="text-sm">Subscriptions</span>
            </div>

            <hr className="my-2" />

            {/* You Section */}
            <h3 className="flex items-center gap-2 font-semibold text-black uppercase">
              You <ChevronRight className="w-5 h-5" />
            </h3>

            {/* Your Channel */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <User className="w-5 h-5" />
              <span className="text-sm">Your Channel</span>
            </div>

            {/* Playlist */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <ListVideo className="w-5 h-5" />
              <span className="text-sm">Playlist</span>
            </div>

            {/* History */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Clock className="w-5 h-5" />
              <span className="text-sm">History</span>
            </div>

            {/* Liked Videos */}
            <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <ThumbsUp className="w-5 h-5" />
              <span className="text-sm">Liked videos</span>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
