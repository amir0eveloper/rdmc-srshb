import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/Accordion";
import FacetClientPanel from "@/components/discover/FacetClientPanel";
import DateFacetClient from "@/components/discover/DateFacetClient";

interface Facet {
    name: string;
    count: number;
}

interface DateRange {
    min: number;
    max: number;
}

async function getFacets(facet: 'subjects' | 'authors'): Promise<Facet[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/discover/${facet}`, { next: { revalidate: 3600 } });
        if (!response.ok) {
            console.error(`API Error for ${facet}: ${response.statusText}`);
            return [];
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(`Fetch Error for ${facet}:`, error);
        return [];
    }
}

async function getDateRange(): Promise<DateRange> {
     try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/discover/date-range`, { next: { revalidate: 3600 } });
        if (!response.ok) {
            console.error(`API Error for date-range: ${response.statusText}`);
            return { min: new Date().getFullYear() - 20, max: new Date().getFullYear() };
        }
        return response.json();
    } catch (error) {
        console.error(`Fetch Error for date-range:`, error);
        return { min: new Date().getFullYear() - 20, max: new Date().getFullYear() };
    }
}

export default async function DiscoverSidebar() {
    const [subjects, authors, dateRange] = await Promise.all([
        getFacets('subjects'),
        getFacets('authors'),
        getDateRange(),
    ]);

    return (
        <aside className="space-y-6 ">
            <h2 className="text-2xl font-bold">Discover</h2>
            <Accordion type="multiple" defaultValue={['subjects', 'authors', 'dates']} className="w-full border rounded-md p-4">
                <AccordionItem value="authors">
                    <AccordionTrigger className="hover:text-blue-500">Author</AccordionTrigger>
                    <AccordionContent>
                        <FacetClientPanel data={authors} facetName="author" />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="subjects">
                    <AccordionTrigger className="hover:text-blue-500">Subject</AccordionTrigger>
                    <AccordionContent>
                        <FacetClientPanel data={subjects} facetName="subject" />
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="dates">
                    <AccordionTrigger className="hover:text-blue-500">Date Issued</AccordionTrigger>
                    <AccordionContent>
                       <DateFacetClient minYear={dateRange.min} maxYear={dateRange.max} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}
