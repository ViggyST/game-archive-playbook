
const BrandingHeader = () => {
  return (
    <div className="px-4 pt-4 pb-2">
      {/* App Branding - Centered */}
      <div className="flex items-center justify-center mb-2">
        <span className="text-2xl mr-2">🧩</span>
        <h1 className="font-poppins font-bold text-2xl text-navy">
          The Game Archive
        </h1>
      </div>
      
      {/* Personalized Greeting - Left aligned */}
      <div className="text-left">
        <h2 className="font-poppins text-xl font-semibold text-navy">
          Hi Kirito <span className="animate-bounce-in inline-block">👋</span>
        </h2>
      </div>
    </div>
  );
};

export default BrandingHeader;
