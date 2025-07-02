import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Clock } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  question_type: 'true_false' | 'multiple_choice' | 'textarea';
  is_mandatory: boolean;
  options?: string[];
}

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorCategories: string[];
  onComplete: () => void;
}

const QuestionnaireModal = ({ isOpen, onClose, vendorCategories, onComplete }: QuestionnaireModalProps) => {
  const [questions] = useState<Question[]>([
    {
      id: '1',
      question_text: 'Do you have experience working with clients in your selected categories?',
      question_type: 'true_false',
      is_mandatory: true,
    },
    {
      id: '2',
      question_text: 'What is your primary service area?',
      question_type: 'multiple_choice',
      is_mandatory: true,
      options: ['Local City', 'State Wide', 'National', 'International']
    },
    {
      id: '3',
      question_text: 'Tell us about your business background and experience',
      question_type: 'textarea',
      is_mandatory: true,
    },
    {
      id: '4',
      question_text: 'Do you have insurance coverage for your services?',
      question_type: 'true_false',
      is_mandatory: false,
    },
    {
      id: '5',
      question_text: 'What is your typical project timeline?',
      question_type: 'multiple_choice',
      is_mandatory: false,
      options: ['Same Day', '1-3 Days', '1 Week', '2-4 Weeks', 'Over 1 Month']
    }
  ]);
  
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleResponseChange = (questionId: string, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleSubmit = () => {
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

    toast({
      title: "Demo Mode",
      description: "Questionnaire responses will be saved when database is configured.",
    });

    onComplete();
    onClose();
  };

  const renderQuestion = (question: Question) => {
    switch (question.question_type) {
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
        const options = question.options || [];
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
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Complete Your Profile Questionnaire
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Demo Mode</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Questionnaire responses will be saved when database tables are created. For now, you can preview the interface.
          </p>
        </div>

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
            <Button onClick={handleSubmit}>
              Complete Questionnaire
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionnaireModal;