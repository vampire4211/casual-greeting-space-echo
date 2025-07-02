import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save, Image } from 'lucide-react';

interface HeroImage {
  id: string;
  title: string;
  image_url: string;
  alt_text: string;
  is_active: boolean;
  display_order: number;
}

interface CarouselImage {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  alt_text: string;
  category: string;
  is_active: boolean;
  display_order: number;
}

const ImageManagement = () => {
  const [heroImages] = useState<HeroImage[]>([
    { 
      id: '1', 
      title: 'Wedding Celebration', 
      image_url: '/placeholder.svg', 
      alt_text: 'Beautiful wedding ceremony', 
      is_active: true,
      display_order: 1
    },
    { 
      id: '2', 
      title: 'Corporate Event', 
      image_url: '/placeholder.svg', 
      alt_text: 'Professional business meeting', 
      is_active: true,
      display_order: 2
    }
  ]);
  
  const [carouselImages] = useState<CarouselImage[]>([
    { 
      id: '1', 
      title: 'Photography', 
      subtitle: 'Capture your precious moments', 
      image_url: '/placeholder.svg', 
      alt_text: 'Professional photography service',
      category: 'Photography', 
      is_active: true,
      display_order: 1
    },
    { 
      id: '2', 
      title: 'Catering', 
      subtitle: 'Delicious food for every occasion', 
      image_url: '/placeholder.svg', 
      alt_text: 'Catering service display',
      category: 'Catering', 
      is_active: true,
      display_order: 2
    }
  ]);
  
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Demo Mode",
      description: `${action} functionality will be available when database tables are created.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Image className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Demo Mode</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Image management is currently in demo mode. Database tables need to be created for full functionality.
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hero">Hero Images</TabsTrigger>
          <TabsTrigger value="carousel">Carousel Images</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hero Section Images</h3>
            <Button onClick={() => handleAction('Add Hero Image')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Hero Image
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroImages.map((image) => (
              <Card key={image.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{image.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <img 
                    src={image.image_url} 
                    alt={image.alt_text || image.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {image.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction('Edit Hero Image')}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleAction('Delete Hero Image')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="carousel" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Carousel Images</h3>
            <Button onClick={() => handleAction('Add Carousel Image')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Carousel Image
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carouselImages.map((image) => (
              <Card key={image.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{image.title}</CardTitle>
                  {image.subtitle && <p className="text-xs text-gray-600">{image.subtitle}</p>}
                </CardHeader>
                <CardContent className="space-y-2">
                  <img 
                    src={image.image_url} 
                    alt={image.alt_text || image.title}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {image.category}
                    </span>
                    <span className={`px-2 py-1 rounded ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {image.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAction('Edit Carousel Image')}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleAction('Delete Carousel Image')}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageManagement;