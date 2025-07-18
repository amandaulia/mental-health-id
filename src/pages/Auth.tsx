import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const { user, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to admin page
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        toast({
          title: "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Mental Health Directory</h1>
          <p className="text-muted-foreground mt-2">Admin Access Portal</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Admin Sign In</CardTitle>
            <CardDescription>
              Sign in with your Google account to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoogleSignIn} 
              className="w-full" 
              disabled={loading}
              variant="outline"
            >
              {loading ? "Signing In..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}