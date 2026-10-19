import { useListFarms } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Calendar, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Farms() {
  const { data: farms, isLoading } = useListFarms();

  if (isLoading) return <div className="p-12 text-center">Loading farms...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground">Meet Our Partner Farmers</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We believe you should know exactly who grows your food. Our network of independent Indian farmers are committed to sustainable, ethical agriculture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(farms) && farms.map((farm) => (
          <Link key={farm.id} href={`/farms/${farm.id}`} className="group flex flex-col bg-card border rounded-3xl overflow-hidden hover:shadow-lg transition-all hover:border-primary/50">
            <div className="relative h-64 overflow-hidden bg-muted">
              {farm.imageUrl ? (
                <img src={farm.imageUrl} alt={farm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                  <Leaf className="h-12 w-12 text-secondary/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="font-serif text-2xl font-bold mb-1">{farm.name}</h2>
                <div className="flex items-center text-sm text-white/80">
                  <MapPin className="h-3 w-3 mr-1" /> {farm.location}{farm.state ? `, ${farm.state}` : ''}
                </div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <p className="text-muted-foreground line-clamp-3 mb-6 flex-1 text-sm leading-relaxed">
                {farm.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {farm.certifications?.map((cert) => (
                  <Badge key={cert} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {cert}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold font-serif text-sm">
                    {farm.farmerName?.charAt(0) || 'F'}
                  </div>
                  <div className="text-sm font-medium">{farm.farmerName}</div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Est. {farm.established}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
