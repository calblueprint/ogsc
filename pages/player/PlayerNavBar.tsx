import { useState } from "react";
import { Player } from "@prisma/client";
import ScoreBox from "../../components/Player/ScoreBox";
import TextLayout from "../../components/Player/TextLayout";

interface playerProp {
  playerProp: Player | undefined;
}

const getContents = (category: string, player: Player | undefined): unknown => {
  switch (category) {
    case "Overview":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">
            Student Overview
          </div>
          <div className="mb-6 text-lg font-bold">Student Bio</div>
          <div className="m-5">
            <TextLayout title="About Me" content={player?.bio} />
            <TextLayout title="Hobbies" content={player?.bio} />
            <TextLayout title="Favorite Subject" content={player?.bio} />
            <TextLayout title="Most Difficult Subject" content={player?.bio} />
            <TextLayout title="Siblings" content={player?.bio} />
            <TextLayout title="Parents" content={player?.bio} />
            <TextLayout title="Favorite Fifa Game" content={player?.bio} />
          </div>
        </div>
      );
    case "Engagement":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">Engagement</div>
          <div className="grid grid-cols-3 gap-24 justify-items-stretch h-56">
            <ScoreBox
              score={player?.academicEngagementScore}
              icon="school"
              title="School"
            />
            <ScoreBox
              score={player?.advisingScore}
              icon="academics"
              title="Academic Advising"
            />
            <ScoreBox
              score={player?.athleticScore}
              icon="athletics"
              title="Athletic"
            />
          </div>
        </div>
      );
    case "Academic Performance":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">
            Academic Performance
          </div>
          <div className="mb-6 text-lg font-bold">Student Bio</div>
          <TextLayout title="GPA" content={player?.gpa} />
          <div className="mb-5 text-sm font-light">Last Updated [the date]</div>
          <div className="mb-6 mt-16 text-lg font-bold">
            Disciplinary Actions
          </div>
          <TextLayout title={null} content={player?.disciplinaryActions} />
        </div>
      );
    case "Physical Wellness":
      return (
        <div>
          <div className="mt-12 mb-10 text-2xl font-display">
            Physical Wellness
          </div>
          <div className="mb-6 text-lg font-bold">Body Mass Index</div>
          <TextLayout title="BMI" content={player?.bmi} />
          <div className="mb-6 mt-16 text-lg font-bold">Fitness Testing</div>
          <TextLayout title="Pacer Test" content={player?.beepTest} />
          <TextLayout title="1 Mile Time" content={player?.mileTime} />
          <TextLayout title="Sit-Ups" content={3} />
          <TextLayout title="Push-Ups" content={81} />
          <div className="mb-6 mt-16 text-lg font-bold">
            Health and Wellness{" "}
          </div>
          <TextLayout title={null} content={player?.healthAndWellness} />
          <div className="h-16" />
        </div>
      );
    default:
      return (
        <div className="mt-12 mb-10 text-2xl font-display">No Informaion</div>
      );
  }
};

const PlayerNavBar: React.FunctionComponent<playerProp> = ({ playerProp }) => {
  const [title, setTitle] = useState("Overview");
  const Button = (category: string): unknown => {
    return (
      <button
        type="button"
        className={
          title === category
            ? "bg-button py-3 px-8 rounded-full font-bold tracking-wide"
            : "py-3 px-8 rounded-full text-unselected tracking-wide"
        }
        onClick={() => {
          setTitle(category);
        }}
      >
        {category}
      </button>
    );
  };
  return (
    <div>
      <div className="flex flex-row justify-between text-sm text-center ">
        {Button("Overview")}
        {Button("Engagement")}
        {Button("Academic Performance")}
        {Button("Attendance")}
        {Button("Physical Wellness")}
        {Button("Highlights")}
      </div>
      {getContents(title, playerProp)}
    </div>
  );
};

export default PlayerNavBar;
