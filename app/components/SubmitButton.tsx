import { CornerDownLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Loader } from "./Loader";

export const SubmitButton = React.forwardRef<HTMLButtonElement>((_, ref) => {
    const {
        formState: { isSubmitting },
    } = useForm();

    return (
        <button
            ref={ref}
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            className="text-white rounded-lg hover:bg-white/25 focus:bg-white/25 w-8 h-8 aspect-square flex items-center justify-center ring-0 outline-0"
        >
            {isSubmitting ? <Loader /> : <CornerDownLeft size={16} />}
        </button>
    );
});
SubmitButton.displayName = "SubmitButton";
