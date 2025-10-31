import ClassRoomCountDownSection from "./_components";

interface ClassRoomCountDown {
  params: {
    sessionId: string
  }
}

const ClassRoomCountDownPage = ({ params }: ClassRoomCountDown) => {
  return (
    <ClassRoomCountDownSection sessionId={params.sessionId} />
  );
}

export default ClassRoomCountDownPage;