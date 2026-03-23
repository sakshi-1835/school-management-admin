export interface StatCardProps {
  title: string;
  value: number | string;
  onClick?: () => void;
}
const StateCard = ({ title, value, onClick }: StatCardProps) => {
  return (
    <div className="bg-white p-4 rounded shadow" onClick={onClick}>
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
};

export default StateCard;
