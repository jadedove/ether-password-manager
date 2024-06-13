import { NoteInterface } from "@/components/provider";
import HooverAnimation from "../../lib/hoover-animation";
import Trash from "../../public/icons/trash.json";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { truncate } from "@/lib/utils";

interface NoteDisplayProps {
  loading: boolean;
  notes: NoteInterface[] | undefined;
  deleteRow: (id: number) => void;
}

const NoteDisplay: React.FC<NoteDisplayProps> = ({
  notes,
  loading,
  deleteRow,
}) => {
  console.log(notes);

  return (
    <div className="flex-grow">
      <Table>
        <TableCaption>All your notes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow className="flex flex-row justify-center text-5xl">
              <TableCell>Loading...</TableCell>
            </TableRow>
          ) : (
            notes &&
            notes.map(({ title, ciphertext, id }, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{title}</TableCell>
                  <TableCell>{truncate(ciphertext)}</TableCell>
                  <TableCell className="flex justify-end">
                    <HooverAnimation
                      animationData={Trash}
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => {
                        deleteRow(id);
                        toast({
                          variant: "destructive",
                          title: "Note deleted",
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NoteDisplay;
