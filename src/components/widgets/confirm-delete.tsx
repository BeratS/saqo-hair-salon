import { useState } from "react";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface IProps {
    children: React.ReactElement;
    onConfirm: () => void;
}

export default function ConfirmDelete({
    children,
    onConfirm
}: IProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger render={children} />
            <PopoverContent className="w-64 text-center">
                <div className="mb-4 font-bold">Are you sure you want to delete it?</div>
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                            onConfirm();
                            setOpen(false);
                        }}
                    >
                        Yes, Delete
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}