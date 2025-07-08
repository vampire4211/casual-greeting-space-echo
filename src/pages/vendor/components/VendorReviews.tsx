import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

interface VendorReviewsProps {
  reviews: Review[];
}

const VendorReviews = ({ reviews }: VendorReviewsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img 
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{review.name}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendorReviews;