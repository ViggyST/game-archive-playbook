import { Settings } from "lucide-react";

const BrandingHeader = () => {
  return (
    <div className="px-6 py-6 bg-white">
      {/* App Branding */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🧩</span>
          <h1 className="font-poppins font-bold text-2xl text-navy">
            The Game Archive
          </h1>
        </div>
      </div>
      
      {/* Settings Button */}
      <div className="absolute top-6 right-6">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="h-6 w-6 text-navy" />
        </button>
      </div>
    </div>
  );
};

export default BrandingHeader;