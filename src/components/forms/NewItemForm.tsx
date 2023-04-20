import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from '@heroicons/react/24/outline';

const NewItemForm = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <PlusIcon className="h-12 w-12 stroke-[3]" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Your Wishlist</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewItemForm;
