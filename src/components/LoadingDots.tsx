
const LoadingDots = ({
  color = "#000",
}: {
  color: string;
  style: string;
}) => {
  return (
    <span className={"small"}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

export default LoadingDots;

LoadingDots.defaultProps = {
  style: "small",
};
