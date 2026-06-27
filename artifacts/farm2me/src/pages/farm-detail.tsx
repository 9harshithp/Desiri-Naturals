import { useGetFarm, useListProducts } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPin, Calendar, Award, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";

export default function FarmDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: farm, isLoading: farmLoading } = useGetFarm(id, { query: { enabled: !!id } });
  const { data: products, isLoading: productsLoading } = useListProducts(
    { farmId: id }, 
    { query: { enabled: !!id } }
  );

  if (farmLoading) return <div className="p-12 text-center">Loading farm details...</div>;
  if (!farm) return <div className="p-12 text-center">Farm not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[40vh] min-h-[400px] w-full bg-muted">
        {farm.coverImageUrl || farm.imageUrl ? (
          <img src={farm.coverImageUrl || farm.imageUrl} alt={farm.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8">
          <Link href="/farms" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Farms
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {farm.certifications?.map((cert) => (
                <Badge key={cert} variant="secondary" className="bg-white/20 text-white hover:bg-white/30 backdrop-blur border-none">
                  {cert}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {farm.name}
            </h1>
            <div className="flex flex-wrap items-center text-white/90 gap-6 text-sm font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> {farm.location}{farm.state ? `, ${farm.state}` : ''}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-secondary" /> Established {farm.established}</span>
              <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-secondary" /> Desiri Naturals Partner</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl font-bold mb-6">The Story</h2>
            <div className="prose prose-lg prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none mb-16">
              <p>{farm.story || farm.description}</p>
            </div>

            <h2 className="font-serif text-3xl font-bold mb-8">Available Produce from {farm.name}</h2>
            {productsLoading ? (
              <div className="text-muted-foreground">Loading produce...</div>
            ) : products && products.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No products currently available from this farm.</p>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-muted/30 border rounded-3xl p-8 text-center">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full overflow-hidden mb-4 border-4 border-background shadow-md">
                {farm.farmerImageUrl ? (
                  <img src={farm.farmerImageUrl} alt={farm.farmerName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-secondary font-serif text-3xl font-bold">
                    {farm.farmerName?.charAt(0) || 'F'}
                  </div>
                )}
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">{farm.farmerName}</h3>
              <p className="text-sm text-muted-foreground mb-6">Head Farmer</p>
              
              <div className="text-left space-y-4 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-bold">{farm.productCount || products?.length || 0}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-bold text-right pl-4">{farm.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
