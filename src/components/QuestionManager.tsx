import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useInterview } from '@/context/InterviewContext';
import { questionAPI } from '@/api';

interface QuestionManagerProps {
  showUploadSection?: boolean;
}

const QuestionManager: React.FC<QuestionManagerProps> = ({ showUploadSection = true }) => {
  const { availableTechStacks, refreshQuestions } = useInterview();
  const [selectedStack, setSelectedStack] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['txt', 'docx', 'csv'].includes(extension)) {
      toast.error('Invalid file format. Please upload .txt, .docx, or .csv files only.');
      return;
    }

    // Demo only - in real app this would send to backend
    toast.success(`File "${file.name}" uploaded successfully (demo)`);
  };

  const handleSingleQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedStack) {
      toast.error('Please select a tech stack');
      return;
    }
    
    if (!questionText) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!difficulty) {
      toast.error('Please select a difficulty level');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the API to create a new question
      const response = await questionAPI.create({
        techStack: selectedStack,
        text: questionText,
        difficulty: difficulty
      });
      
      if (response.data && response.data.success) {
        toast.success('Question added successfully');
        
        // Refresh questions for this stack
        await refreshQuestions(selectedStack);
        
        // Reset form
        setQuestionText('');
        setDifficulty('');
      } else {
        toast.error('Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {showUploadSection && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Questions File</CardTitle>
            <CardDescription>
              Upload questions in bulk using .txt, .docx, or .csv files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stack-select">Select Tech Stack</Label>
                <Select value={selectedStack} onValueChange={setSelectedStack}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a tech stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTechStacks.map((stack) => (
                      <SelectItem key={stack.id} value={stack.id}>
                        {stack.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt,.docx,.csv"
                    className="flex-1"
                    onChange={handleFileUpload}
                  />
                  <Button variant="secondary">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported formats: .txt, .docx, .csv
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Single Question</CardTitle>
          <CardDescription>
            Add a single question to the selected tech stack
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSingleQuestion} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-tech-stack">Tech Stack</Label>
              <Select value={selectedStack} onValueChange={setSelectedStack}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tech stack" />
                </SelectTrigger>
                <SelectContent>
                  {availableTechStacks.map((stack) => (
                    <SelectItem key={stack.id} value={stack.id}>
                      {stack.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="question-text">Question</Label>
              <Textarea
                id="question-text"
                placeholder="Enter your question here..."
                className="min-h-[100px]"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Question'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionManager;
