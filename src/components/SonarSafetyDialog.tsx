
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface SonarSafetyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  showDontAskOption?: boolean
  onDontAskAgainChange?: (checked: boolean) => void
  title: string
  description: string
}

const SonarSafetyDialog = ({
  open,
  onOpenChange,
  onConfirm,
  showDontAskOption,
  onDontAskAgainChange,
  title,
  description,
}: SonarSafetyDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {showDontAskOption && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dont-show" 
              onCheckedChange={(checked) => 
                onDontAskAgainChange?.(checked as boolean)
              } 
            />
            <label 
              htmlFor="dont-show" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't show this warning again this session
            </label>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default SonarSafetyDialog
