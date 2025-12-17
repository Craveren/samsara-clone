import { useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './EstateWizard.scss';

const steps = [
  {
    label: 'Personal Information',
    description: 'Tell us about yourself',
    fields: [
      { name: 'fullName', label: 'Full Name', type: 'text', required: true },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { name: 'maritalStatus', label: 'Marital Status', type: 'radio', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
    ],
  },
  {
    label: 'Estate Overview',
    description: 'Basic estate information',
    fields: [
      { name: 'totalAssets', label: 'Estimated Total Assets ($)', type: 'number', required: true },
      { name: 'hasWill', label: 'Do you have a will?', type: 'checkbox', required: false },
      { name: 'hasTrust', label: 'Do you have a trust?', type: 'checkbox', required: false },
    ],
  },
  {
    label: 'Beneficiaries',
    description: 'Who should inherit your estate?',
    fields: [
      { name: 'primaryBeneficiary', label: 'Primary Beneficiary Name', type: 'text', required: true },
      { name: 'beneficiaryRelationship', label: 'Relationship', type: 'text', required: true },
    ],
  },
  {
    label: 'Executor & Healthcare',
    description: 'Important designations',
    fields: [
      { name: 'executorName', label: 'Executor Name', type: 'text', required: true },
      { name: 'healthcareProxy', label: 'Healthcare Proxy Name', type: 'text', required: false },
    ],
  },
  {
    label: 'Review & Complete',
    description: 'Review your information',
    fields: [],
  },
];

function EstateWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = () => {
    // Save form data (in real app, this would go to backend)
    if (process.env.NODE_ENV === 'development') {
      console.log('Estate wizard data saved:', Object.keys(formData).length, 'sections');
    }
    localStorage.setItem('estateWizardData', JSON.stringify(formData));
    alert('Estate information saved successfully!');
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
            margin="normal"
            variant="outlined"
          />
        );
      case 'checkbox':
        return (
          <FormControlLabel
            key={field.name}
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
      case 'radio':
        return (
          <FormControl key={field.name} component="fieldset" margin="normal" fullWidth>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              {field.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      default:
        return null;
    }
  };

  const renderReview = () => {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Review Your Information
        </Typography>
        {Object.entries(formData).map(([key, value]) => (
          <Box key={key} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
            </Typography>
            <Typography variant="body1">{String(value)}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <FusePageSimple
      header={
        <Box p={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Estate Builder
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Step-by-step estate planning wizard
          </Typography>
        </Box>
      }
      content={
        <Box p={3}>
          <Card sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    {index === steps.length - 1 ? (
                      renderReview()
                    ) : (
                      <Box>
                        {step.fields.map((field) => renderField(field))}
                      </Box>
                    )}
                    <Box sx={{ mb: 2, mt: 3 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {index === steps.length - 1 ? 'Complete' : 'Continue'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Card>
        </Box>
      }
    />
  );
}

export default EstateWizard;
