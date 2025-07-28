import { useNavigate } from "react-router-dom";

interface ActionCardProps {
  title: string;
  subtitle: string;
  gradient: string;
  href: string;
}

const ActionCard = ({ title, subtitle, gradient, href }: ActionCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(href)}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 ${gradient} shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-white"></div>
      <h3 className="font-poppins font-bold text-lg text-white">{title}</h3>
      <p className="font-inter text-sm text-white mt-2">{subtitle}</p>
    </button>
  );
};

export const ActionCards = () => {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 py-8">
      <ActionCard
        title="📈 Track My Games"
        subtitle="View detailed stats & insights"
        gradient="from-orange-400 to-red-500"
        href="/track-games"
      />
      <ActionCard
        title="✏️ Log a Game"
        subtitle="Record your latest session"
        gradient="from-blue-400 to-purple-500"
        href="/log-game"
      />
      <ActionCard
        title="🎒 My Collection"
        subtitle="View owned games & wishlist"
        gradient="from-purple-500 to-pink-600"
        href="/collections"
      />
    </div>
  );
};
