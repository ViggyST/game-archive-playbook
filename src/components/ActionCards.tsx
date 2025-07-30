
import { useNavigate } from 'react-router-dom';
import { Calendar, GamepadIcon, Package } from 'lucide-react';

const ActionCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "📊 Track My Games",
      subtitle: "See patterns & stats",
      icon: <Calendar className="w-6 h-6" />,
      gradient: "from-blue-500 to-purple-600",
      onClick: () => navigate('/track-games')
    },
    {
      title: "🎮 Log a Game",
      subtitle: "Record a new session",
      icon: <GamepadIcon className="w-6 h-6" />,
      gradient: "from-green-500 to-emerald-600",
      onClick: () => navigate('/log-game')
    },
    {
      title: "🎒 My Collection",
      subtitle: "View owned games & wishlist",
      icon: <Package className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-600",
      onClick: () => navigate('/collections')
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            className={`
              relative p-4 rounded-xl cursor-pointer
              bg-gradient-to-br ${card.gradient}
              text-white shadow-md hover:shadow-lg
              transition-all duration-300 transform hover:scale-[1.02]
              active:scale-95 select-none
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-base font-bold mb-1">{card.title}</h3>
                <p className="text-sm opacity-90">{card.subtitle}</p>
              </div>
              <div className="opacity-80 ml-3">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionCards;
