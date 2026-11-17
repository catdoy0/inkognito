import Spinner from "./widgets/Spinner";

/** Full-screen overlay shown while the initial refresh-cookie check is pending. */
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <Spinner size={48} />
    </div>
  );
}
