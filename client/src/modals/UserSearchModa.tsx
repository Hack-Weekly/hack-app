import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  Fieldset,
  Flex,
  IconButton,
  Input,
  Label,
} from "./ModalShared";
import { colors } from "../branding";

export function UserSearchModalBtn() {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>Create account</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogTitle>Create account</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
          <Fieldset>
            <Label htmlFor="email">Email</Label>
          </Fieldset>
          <Fieldset>
            <Label htmlFor="username">Username</Label>
          </Fieldset>
          <Fieldset>
            <Label htmlFor="password">Password</Label>
          </Fieldset>
          <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
            <Button>Create</Button>
          </Flex>
          <Dialog.Close asChild>
            <IconButton aria-label="Close">X</IconButton>
          </Dialog.Close>
          <Flex>
            {errorMessage && (
              <Flex css={{ color: colors.errorText }}>{errorMessage}</Flex>
            )}
            {successMessage && (
              <Flex css={{ color: colors.successText }}>{successMessage}</Flex>
            )}
          </Flex>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
