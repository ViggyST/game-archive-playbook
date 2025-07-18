
const BrandingHeader = () => {
  return (
    <div className="px-4 pt-6 pb-4 sm:px-6 sm:pt-8">
      {/* App Branding - Mobile centered, larger screens left */}
      <div className="flex items-center justify-center sm:justify-start mb-3 sm:mb-4">
        <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🧩</span>
        <h1 className="font-poppins font-bold text-2xl sm:text-3xl text-navy">
          The Game Archive
        </h1>
      </div>
      
      {/* Personalized Greeting - Always left aligned, mobile optimized */}
      <div className="text-left">
        <h2 className="font-poppins text-lg sm:text-xl font-semibold text-navy">
          Hi Kirito <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
    </div>
  );
};

export default BrandingHeader;
