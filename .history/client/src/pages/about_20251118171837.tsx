import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Award, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            About SnacIn
          </h1>
          <p className="text-muted-foreground text-lg">
            Your trusted source for premium fox nuts and dry fruits
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Snac was founded with a simple mission: to bring the finest quality 
                fox nuts (makhana) and dry fruits from the heart of India directly to your 
                doorstep. We believe that healthy snacking should never compromise on taste 
                or quality.
              </p>
              <p className="text-muted-foreground mb-4">
                Sourced from the pristine farms of Bihar and other regions known for their 
                premium produce, our products undergo rigorous quality checks to ensure you 
                receive only the best. Every batch is carefully selected, processed, and 
                packaged to preserve maximum freshness and nutritional value.
              </p>
              <p className="text-muted-foreground">
                We take pride in supporting local farmers and sustainable farming practices, 
                ensuring that every purchase you make contributes to a healthier you and a 
                better tomorrow for our farming communities.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">100% Natural</h3>
                  <p className="text-muted-foreground text-sm">
                    No artificial flavors, colors, or preservatives. Just pure, wholesome goodness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Health First</h3>
                  <p className="text-muted-foreground text-sm">
                    Rich in nutrients, low in calories. Perfect for health-conscious individuals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                  <p className="text-muted-foreground text-sm">
                    Certified and tested to meet the highest quality standards in the industry.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Customer Focused</h3>
                  <p className="text-muted-foreground text-sm">
                    Your satisfaction is our priority. We're here to serve you better every day.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="font-serif text-2xl font-bold mb-4">
              Join Our Healthy Living Community
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Experience the perfect blend of tradition, taste, and nutrition with SnacIn.
            </p>
            <p className="text-sm opacity-80">
              Thank you for choosing us as your partner in healthy snacking!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
