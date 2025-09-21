interface HeaderData {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderData) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
        {title}
      </h1>
      <p className="text-base lg:text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}
