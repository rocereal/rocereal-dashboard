/**
 * Contact Header Component
 * Header section for contact pages displaying title and subtitle
 * Provides consistent header styling with responsive typography
 * Used across contact pages to introduce content sections
 * @param title - Main heading text for the contact section
 * @param subtitle - Descriptive subtitle text below the main title
 * @returns JSX element representing the contact header section
 */

interface HeaderData {
  title: string;
  subtitle: string;
}

/**
 * Header component for displaying contact page titles and descriptions
 * Renders centered header with responsive typography and proper spacing
 * Provides consistent visual hierarchy for contact page sections
 * @param title - The main title text to display
 * @param subtitle - The subtitle text to display below the title
 * @returns JSX element representing the header section
 */
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
