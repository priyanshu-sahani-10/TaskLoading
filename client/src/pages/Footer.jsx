import { Link } from "react-router-dom";

const Footer=()=>{
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        
        {/* Left: Quote or Tagline */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Empowering Communities, One Report at a Time.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Built with ❤️ for civic change.
          </p>
        </div>

        {/* Right: Quick Links */}
        
      </div>

      <p className=" text-gray-500 dark:text-gray-600 mt-6 text-center text-2xl">
        © {new Date().getFullYear()} TaskLoading. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
