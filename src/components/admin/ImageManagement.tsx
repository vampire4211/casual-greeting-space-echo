
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type HeroImage = Tables<'hero_images'>;
type CarouselImage = Tables<'carousel_images'>;

const ImageManagement = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [showCarouselModal, setShowCarouselModal] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroImage | null>(null);
  const [editingCarousel, setEditingCarousel] = useState<CarouselImage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const [heroResponse, carouselResponse] = await Promise.all([
        supabase.from('hero_images').select('*').order('display_order'),
        supabase.from('carousel_images').select('*').order('display_order')
      ]);

      if (heroResponse.data) setHeroImages(heroResponse.data);
      if (carouselResponse.data) setCarouselImages(carouselResponse.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSaveHeroImage = async (formData: FormData) => {
    try {
      const imageData = {
        title: formData.get('title') as string,
        image_url: formData.get('image_url') as string,
        alt_text: formData.get('alt_text') as string,
        is_active: formData.get('is_active') === 'true',
        display_order: parseInt(formData.get('display_order') as string) || 0
      };

      if (editingHero) {
        const { error } = await supabase
          .from('hero_images')
          .update(imageData)
          .eq('id', editingHero.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_images')
          .insert(imageData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Hero image ${editingHero ? 'updated' : 'created'} successfully!`,
      });

      fetchImages();
      setShowHeroModal(false);
      setEditingHero(null);
    } catch (error) {
      console.error('Error saving hero image:', error);
      toast({
        title: "Error",
        description: "Failed to save hero image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCarouselImage = async (formData: FormData) => {
    try {
      const imageData = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        image_url: formData.get('image_url') as string,
        alt_text: formData.get('alt_text') as string,
        category: formData.get('category') as string,
        is_active: formData.get('is_active') === 'true',
        display_order: parseInt(formData.get('display_order') as string) || 0
      };

      if (editingCarousel) {
        const { error } = await supabase
          .from('carousel_images')
          .update(imageData)
          .eq('id', editingCarousel.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('carousel_images')
          .insert(imageData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Carousel image ${editingCarousel ? 'updated' : 'created'} successfully!`,
      });

      fetchImages();
      setShowCarouselModal(false);
      setEditingCarousel(null);
    } catch (error) {
      console.error('Error saving carousel image:', error);
      toast({
        title: "Error",
        description: "Failed to save carousel image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteImage = async (type: 'hero' | 'carousel', id: string) => {
    try {
      const tableName = type === 'hero' ? 'hero_images' : 'carousel_images';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });

      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hero">Hero Images</TabsTrigger>
          <TabsTrigger value="carousel">Carousel Images</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Hero Section Images</h3>
            <Button onClick={() => setShowHeroModal(true)}>
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
                        onClick={() => {
                          setEditingHero(image);
                          setShowHeroModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteImage('hero', image.id)}
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
            <Button onClick={() => setShowCarouselModal(true)}>
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
                      onClick={() => {
                        setEditingCarousel(image);
                        setShowCarouselModal(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteImage('carousel', image.id)}
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

      {/* Hero Image Modal */}
      <Dialog open={showHeroModal} onOpenChange={setShowHeroModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingHero ? 'Edit' : 'Add'} Hero Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveHeroImage(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={editingHero?.title || ''} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input 
                id="image_url" 
                name="image_url" 
                type="url"
                defaultValue={editingHero?.image_url || ''} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input 
                id="alt_text" 
                name="alt_text" 
                defaultValue={editingHero?.alt_text || ''} 
              />
            </div>
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input 
                id="display_order" 
                name="display_order" 
                type="number"
                defaultValue={editingHero?.display_order || 0} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                name="is_active"
                defaultChecked={editingHero?.is_active ?? true}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Hero Image
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Carousel Image Modal */}
      <Dialog open={showCarouselModal} onOpenChange={setShowCarouselModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCarousel ? 'Edit' : 'Add'} Carousel Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveCarouselImage(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={editingCarousel?.title || ''} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input 
                id="subtitle" 
                name="subtitle" 
                defaultValue={editingCarousel?.subtitle || ''} 
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input 
                id="image_url" 
                name="image_url" 
                type="url"
                defaultValue={editingCarousel?.image_url || ''} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="alt_text">Alt Text</Label>
              <Input 
                id="alt_text" 
                name="alt_text" 
                defaultValue={editingCarousel?.alt_text || ''} 
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                name="category" 
                defaultValue={editingCarousel?.category || ''} 
              />
            </div>
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input 
                id="display_order" 
                name="display_order" 
                type="number"
                defaultValue={editingCarousel?.display_order || 0} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="is_active" 
                name="is_active"
                defaultChecked={editingCarousel?.is_active ?? true}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <Button type="submit" className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Carousel Image
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageManagement;
