import { ResizeVolumeSchema } from '@linode/validation/lib/volumes.schema';
import { Form, Formik } from 'formik';
import * as React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Notice } from 'src/components/Notice/Notice';
import { resetEventsPolling } from 'src/eventsPolling';
import { useResizeVolumeMutation } from 'src/queries/volumes';
import {
  handleFieldErrors,
  handleGeneralErrors,
} from 'src/utilities/formikErrorUtils';

import NoticePanel from './NoticePanel';
import { PricePanel } from './PricePanel';
import SizeField from './SizeField';

interface Props {
  onClose: () => void;
  onSuccess: (volumeLabel: string, message?: string) => void;
  readOnly?: boolean;
  volumeId: number;
  volumeLabel: string;
  volumeSize: number;
}

export const ResizeVolumeForm = (props: Props) => {
  const {
    onClose,
    onSuccess,
    readOnly,
    volumeId,
    volumeLabel,
    volumeSize,
  } = props;

  const { mutateAsync: resizeVolume } = useResizeVolumeMutation();

  const initialValues = { size: volumeSize };
  const validationSchema = ResizeVolumeSchema(volumeSize);

  return (
    <Formik
      onSubmit={(
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        setSubmitting(true);

        resizeVolume({ size: Number(values.size), volumeId })
          .then((_) => {
            resetForm({ values: initialValues });
            setSubmitting(false);
            resetEventsPolling();
            onSuccess(volumeLabel, `Volume scheduled to be resized.`);
          })
          .catch((errorResponse) => {
            const defaultMessage = `Unable to resize this volume at this time. Please try again later.`;
            const mapErrorToStatus = (generalError: string) =>
              setStatus({ generalError });

            setSubmitting(false);
            handleFieldErrors(setErrors, errorResponse);
            handleGeneralErrors(
              mapErrorToStatus,
              errorResponse,
              defaultMessage
            );
          });
      }}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        resetForm,
        status,
        values,
      }) => {
        return (
          <Form>
            {status && (
              <NoticePanel
                error={status.generalError}
                success={status.success}
              />
            )}
            {readOnly && (
              <Notice
                error={true}
                important
                text={`You don't have permissions to edit ${volumeLabel}. Please contact an account administrator for details.`}
              />
            )}
            <SizeField
              disabled={readOnly}
              error={errors.size}
              name="size"
              onBlur={handleBlur}
              onChange={handleChange}
              resize={volumeSize}
              value={values.size}
            />
            <PricePanel currentSize={volumeSize} value={values.size} />
            <ActionsPanel
              primaryButtonProps={
                handleSubmit
                  ? {
                      'data-testid': 'submit',
                      disabled: readOnly,
                      label: 'Resize Volume',
                      loading: isSubmitting,
                      onClick: () => handleSubmit(),
                    }
                  : undefined
              }
              secondaryButtonProps={
                onClose
                  ? {
                      'data-testid': 'cancel',
                      label: 'Cancel',
                      onClick: () => {
                        resetForm();
                        onClose();
                      },
                    }
                  : undefined
              }
            />
          </Form>
        );
      }}
    </Formik>
  );
};
