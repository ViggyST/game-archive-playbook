
import { useNavigate } from 'react-router-dom';
import { Calendar, GamepadIcon, Package } from 'lucide-react';

const ActionCards = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "📊 Track My Games",
      subtitle: "See patterns & stats",
      icon: <Calendar className="w-8 h-8" />,
      gradient: "from-blue-500 to-purple-600",
      onClick: () => navigate('/track-games')
    },
    {
      title: "🎮 Log a Game",
      subtitle: "Record a new session",
      icon: <GamepadIcon className="w-8 h-8" />,
      gradient: "from-green-500 to-emerald-600",
      onClick: () => navigate('/log-game')
    },
    {
      title: "🎒 My Collection",
      subtitle: "View owned games & wishlist",
      icon: <Package className="w-8 h-8" />,
      gradient: "from-purple-500 to-pink-600",
      onClick: () => navigate('/collections')
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mt-8">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={card.onClick}
          className={`
            relative p-6 rounded-2xl cursor-pointer
            bg-gradient-to-br ${card.gradient}
            text-white shadow-lg hover:shadow-xl
            transition-all duration-300 transform hover:scale-105
            active:scale-95 select-none
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">{card.title}</h3>
              <p className="text-sm opacity-90">{card.subtitle}</p>
            </div>
            <div className="opacity-80">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionCards;
