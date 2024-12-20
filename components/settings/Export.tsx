import { exportToPdf } from "@/lib/utils";
import { Button } from "../ui/button";

interface ExportProps {
  notepadContent: string;
}

const Export: React.FC<ExportProps> = ({ notepadContent }) => (
  <div className='flex flex-col gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Export</h3>
    <Button
      variant='outline'
      className='w-full border border-primary-grey-100 hover:bg-yellow-100 hover:text-primary-black'
      onClick={() => exportToPdf(notepadContent)}
    >
      Export to PDF
    </Button>
  </div>
);

export default Export;