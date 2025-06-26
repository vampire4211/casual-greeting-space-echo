
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Question = Tables<'questions'>;

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorCategories: string[];
  onComplete: () => void;
}

const QuestionnaireModal = ({ isOpen, onClose, vendorCategories, onComplete }: QuestionnaireModalProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, vendorCategories]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Fetch static questions (10 questions)
      const { data: staticQuestions, error: staticError } = await supabase
        .from('questions')
        .select('*')
        .eq('is_static', true)
        .limit(10);

      if (staticError) throw staticError;

      // Fetch category-specific questions
      let categoryQuestions: Question[] = [];
      if (vendorCategories.length > 0) {
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('id')
          .in('name', vendorCategories);

        if (categoriesError) throw categoriesError;

        if (categories && categories.length > 0) {
          const categoryIds = categories.map(cat => cat.id);
          const questionsPerCategory = Math.floor(10 / vendorCategories.length);
          
          const { data: catQuestions, error: catError } = await supabase
            .from('questions')
            .select('*')
            .eq('is_static', false)
            .in('category_id', categoryIds)
            .limit(questionsPerCategory * vendorCategories.length);

          if (catError) throw catError;
          categoryQuestions = catQuestions || [];
        }
      }

      const allQuestions = [...(staticQuestions || []), ...categoryQuestions];
      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate mandatory questions
      const mandatoryQuestions = questions.filter(q => q.is_mandatory);
      const missingResponses = mandatoryQuestions.filter(q => !responses[q.id]);
      
      if (missingResponses.length > 0) {
        toast({
          title: "Missing Required Responses",
          description: "Please answer all mandatory questions.",
          variant: "destructive",
        });
        return;
      }

      // Get vendor profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: vendorProfile, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (vendorError) throw vendorError;

      // Save responses
      const responseData = Object.entries(responses).map(([questionId, response]) => ({
        vendor_id: vendorProfile.id,
        question_id: questionId,
        response: response
      }));

      const { error: insertError } = await supabase
        .from('vendor_question_responses')
        .upsert(responseData);

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Questionnaire completed successfully!",
      });

      onComplete();
      onClose();
    } catch (error) {
      console.error('Error saving responses:', error);
      toast({
        title: "Error",
        description: "Failed to save responses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: Question) => {
    const questionType = question.question_type as 'true_false' | 'multiple_choice' | 'textarea';
    
    switch (questionType) {
      case 'true_false':
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => handleResponseChange(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label htmlFor={`${question.id}-false`}>No</Label>
            </div>
          </RadioGroup>
        );

      case 'multiple_choice':
        const options = question.options as string[] || [];
        return (
          <RadioGroup
            value={responses[question.id] || ''}
            onValueChange={(value) => handleResponseChange(question.id, value)}
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'textarea':
        return (
          <Textarea
            value={responses[question.id] || ''}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your response..."
            className="min-h-[100px]"
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Profile Questionnaire</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    {question.question_text}
                    {question.is_mandatory && (
                      <span className="text-red-500 text-sm">*</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderQuestion(question)}
                </CardContent>
              </Card>
            ))}
            
            <div className="flex justify-end gap-4 pt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Complete Questionnaire'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireModal;
