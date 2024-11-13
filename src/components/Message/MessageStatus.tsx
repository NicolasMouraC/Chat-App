import ReadTick from "../../img/read-tick.png";
import SentTick from "../../img/sent-tick.png";
import DeliveredTick from "../../img/delivered-tick.png";
import MessageStatusType from "../../types/messages/MessageStatusType";

export const MessageStatus: React.FC<{ status: MessageStatusType }> = ({
  status,
}) => {
  if (status.read) return <img src={ReadTick} className="tick" alt="Read" />;
  if (status.delivered)
    return <img src={DeliveredTick} className="tick" alt="Delivered" />;
  if (status.sent)
    return (
      <img
        src={SentTick}
        data-testid="single-tick"
        className="tick"
        alt="Sent"
      />
    );
  return null;
};
