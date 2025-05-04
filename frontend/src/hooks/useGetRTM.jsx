import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "@/redux/chatSlice";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector(store => store.socketio);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, dispatch]);
};

export default useGetRTM;
