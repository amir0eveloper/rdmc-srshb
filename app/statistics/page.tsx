
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'; // Assuming Card components are available
// You'll create these components later
import SummaryStats from '@/components/statistics/SummaryStats';
import TopDownloadsChart from '@/components/statistics/TopDownloadsChart';
import TopAuthorsChart from '@/components/statistics/TopAuthorsChart';
import SubmissionsByTypeChart from '@/components/statistics/SubmissionsByTypeChart';
import SubmissionsOverTimeChart from '@/components/statistics/SubmissionsOverTimeChart';
import DownloadsOverTimeChart from '@/components/statistics/DownloadsOverTimeChart';
import MostActiveCollectionsTable from '@/components/statistics/MostActiveCollectionsTable';

export default async function StatisticsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Repository Statistics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Suspense fallback={
          <>
            <Card><CardHeader><CardTitle>Total Items</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Total Collections</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Total Communities</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>
            <Card><CardHeader><CardTitle>Total Downloads</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>
            <Card><CardHeader><CardTitle>New Submissions (This Month)</CardTitle></CardHeader><CardContent><p>Loading...</p></CardContent></Card>
          </>
        }>
          <SummaryStats />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Suspense fallback={<p>Loading top downloads chart...</p>}>
          <TopDownloadsChart />
        </Suspense>

        <Suspense fallback={<p>Loading top authors chart...</p>}>
          <TopAuthorsChart />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Suspense fallback={<p>Loading submissions by type chart...</p>}>
          <SubmissionsByTypeChart />
        </Suspense>

        <Suspense fallback={<p>Loading submissions over time chart...</p>}>
          <SubmissionsOverTimeChart />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Suspense fallback={<p>Loading downloads over time chart...</p>}>
          <DownloadsOverTimeChart />
        </Suspense>

        <Suspense fallback={<p>Loading most active collections table...</p>}>
          <MostActiveCollectionsTable />
        </Suspense>
      </div>
    </div>
  );
}
