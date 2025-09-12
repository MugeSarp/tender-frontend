export default function Navbar() {
  return (
    <div className="w-full flex justify-center items-center h-24 border-b border-gray-200 bg-gray-50">
      <div className="container px-5">
        <img
          src="/infinia-logo.svg"
          alt="logo"
          className="w-[132px] h-[30px] select-none"
        />
        <span className="text-gray-500 text-sm">Tender Opportunities</span>
      </div>
    </div>
  );
}
