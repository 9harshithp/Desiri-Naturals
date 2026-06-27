import { useListBoxes } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Package, Check, RefreshCw } from "lucide-react";

export default function Boxes() {
  const { data: boxes, isLoading } = useListBoxes();

  if (isLoading) return <div className="p-12 text-center">Loading subscription boxes...</div>;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-4 text-secondary border-secondary/30 bg-secondary/5">Desiri Naturals Subscriptions</Badge>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Fresh harvests, delivered regularly.</h1>
        <p className="text-lg text-muted-foreground">
          Let the seasons dictate your menu. Subscribe to our farm boxes to get a curated selection of the freshest produce delivered to your door. Skip or cancel anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {boxes?.map((box) => (
          <div key={box.id} className={`relative flex flex-col bg-card rounded-3xl border ${box.isPopular ? 'border-primary shadow-lg scale-105 z-10' : 'shadow-sm'} overflow-hidden`}>
            {box.isPopular && (
              <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1.5 tracking-wider uppercase">
                Most Popular
              </div>
            )}
            
            <div className="p-8 pb-0">
              <h2 className="font-serif text-2xl font-bold mb-2">{box.name}</h2>
              <p className="text-muted-foreground text-sm mb-6 h-10">{box.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">₹{box.price}</span>
                <span className="text-muted-foreground font-medium"> / {box.frequency}</span>
              </div>

              {box.highlight && (
                <div className="bg-secondary/10 text-secondary-foreground text-sm px-4 py-3 rounded-xl mb-8 flex items-start gap-3">
                  <Leaf className="h-5 w-5 text-secondary shrink-0" />
                  <span className="font-medium">{box.highlight}</span>
                </div>
              )}
            </div>

            <div className="p-8 pt-0 flex-1 flex flex-col">
              <div className="flex-1">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">What's Inside</h4>
                <ul className="space-y-3 mb-8">
                  {box.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="bg-primary/10 p-1 rounded-full text-primary mt-0.5 shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                size="lg" 
                className={`w-full rounded-full h-14 ${box.isPopular ? '' : 'bg-muted text-foreground hover:bg-muted/80 border'}`}
              >
                Subscribe Now
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-24 max-w-4xl mx-auto bg-muted/50 rounded-3xl p-8 md:p-12 border flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shrink-0 shadow-sm">
          <RefreshCw className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold mb-2">Total Flexibility</h3>
          <p className="text-muted-foreground">
            Going on vacation? Having guests over? You can easily pause, skip, or modify your subscription size at any time through your account dashboard. No commitments, just fresh food when you need it.
          </p>
        </div>
      </div>
    </div>
  );
}
