/**
 * Footer Component
 * Displays version number and project name at the bottom of the application
 * @returns The footer JSX element
 */
export function Footer() {
  const version = "1.0.0"; // You can make this dynamic if needed

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>Fisio v{version}</span>
        </div>
      </div>
    </footer>
  );
}
