import { Button } from "./button";
import { ButtonTransition } from "./transitions";

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export function AnimatedButton({ children, ...props }: AnimatedButtonProps) {
  return (
    <ButtonTransition>
      <Button {...props}>{children}</Button>
    </ButtonTransition>
  );
}
