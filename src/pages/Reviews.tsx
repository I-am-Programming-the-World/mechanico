import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const Reviews = () => {
  const { user } = useAuth();
  const { reviews, users } = useData();

  const relevantReviews = reviews.filter(r => 
    user?.role === 'provider' ? r.providerId === user.id : true
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-warning text-warning'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          \1\2 font-display text-balance mb-4 md:mb-6\3>نظرات و امتیازها</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'provider' 
              ? 'نظرات مشتریان درباره خدمات شما'
              : 'تمام نظرات ثبت شده در پلتفرم'}
          </p>
        </div>

        <div className="space-y-4">
          {relevantReviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">هنوز نظری ثبت نشده است</p>
              </CardContent>
            </Card>
          ) : (
            relevantReviews.map((review) => {
              const customer = users.find(u => u.id === review.customerId);
              const provider = users.find(u => u.id === review.providerId);

              const fallbackInitial = customer?.fullName?.charAt(0) ?? 'م';

              return (
                <Card key={review.id} className="shadow-card hover:shadow-primary transition-all" aria-label={`نظر ثبت شده توسط ${customer?.fullName ?? 'مشتری ناشناس'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {fallbackInitial}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-medium">{customer?.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.role !== 'provider' && provider && `برای ${provider.fullName}`}
                          </p>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;