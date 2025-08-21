import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAudio,
  FaFileVideo,
  FaFileAlt,
} from "react-icons/fa";

export const iconMap: { keyword: string; icon: any }[] = [
  { keyword: "pdf", icon: <FaFilePdf className="text-mainDark text-3xl" /> },
  { keyword: "word", icon: <FaFileWord className="text-mainDark text-3xl" /> },
  {
    keyword: "excel",
    icon: <FaFileExcel className="text-mainDark text-3xl" />,
  },
  {
    keyword: "audio",
    icon: <FaFileAudio className="text-mainDark text-3xl" />,
  },
  {
    keyword: "video",
    icon: <FaFileVideo className="text-mainDark text-3xl" />,
  },
];

export const getFileIcon = (file: File) => {
  const found = iconMap.find(({ keyword }) => file.type.includes(keyword));
  return found ? found.icon : <FaFileAlt className="text-mainDark text-3xl" />;
};
