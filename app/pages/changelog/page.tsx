import Link from "next/link";
import { changelog } from "../../../data/changelog";

export default function ChangelogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Changelog</h1>
      <div className="space-y-8">
        {changelog.map((entry) => (
          <div key={entry.version} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              [{entry.version}] - {entry.date}
            </h2>
            {entry.changes.added && entry.changes.added.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-green-600 mb-2">
                  Added
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {entry.changes.added.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
            {entry.changes.changed && entry.changes.changed.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-blue-600 mb-2">
                  Changed
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {entry.changes.changed.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
            {entry.changes.fixed && entry.changes.fixed.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-red-600 mb-2">Fixed</h3>
                <ul className="list-disc list-inside space-y-1">
                  {entry.changes.fixed.map((change, index) => (
                    <li key={index}>{change}</li>
                  ))}
                </ul>
              </div>
            )}
            {entry.pages && entry.pages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-purple-600 mb-2">
                  Available Pages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {entry.pages.map((page, index) => (
                    <Link
                      key={index}
                      href={page}
                      className="text-blue-500 hover:underline"
                    >
                      {page}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
