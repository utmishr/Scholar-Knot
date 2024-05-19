import XSvg from "../svgs/X";

import { MdTipsAndUpdates } from "react-icons/md";
import { FaUser, FaWpexplorer, FaOutdent } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <div className="flex items-center">
          <Link to="/" className="flex justify-center md:justify-start">
            <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
          </Link>
          <div className="text-white font-bold text-2xl">Scholar Knot</div>
        </div>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaWpexplorer className="w-8 h-8" />
              <span className="text-lg hidden md:block">Explore</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdTipsAndUpdates className="w-6 h-6" />
              <span className="text-lg hidden md:block">Updates</span>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Portfolio</span>
            </Link>
          </li>
        </ul>
        <div className="flex justify-center md:justify-start mt-auto">
          <div
            className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <FaOutdent className="w-6 h-6" />
            <span className="text-lg hidden md:block">Terminate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
