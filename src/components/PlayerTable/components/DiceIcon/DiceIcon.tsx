import {
  CgDice1,
  CgDice2,
  CgDice3,
  CgDice4,
  CgDice5,
  CgDice6,
} from "react-icons/cg";

const DiceIcon = ({ value }: { value: number }) => {
  switch (value) {
    case 1:
      return <CgDice1 />;
    case 2:
      return <CgDice2 />;
    case 3:
      return <CgDice3 />;
    case 4:
      return <CgDice4 />;
    case 5:
      return <CgDice5 />;
    case 6:
      return <CgDice6 />;
    default:
      return <CgDice1 />;
  }
};

export default DiceIcon;
