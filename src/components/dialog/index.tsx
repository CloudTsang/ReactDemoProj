import React, {useMemo} from 'react';
import Button from '../ui/custom-button';
import {Dialog, DialogContent, DialogContentText} from '@material-ui/core';

import './dialog.scss';
import { useGlobalState } from '@/containers/root-container';
import { globalStore } from '@/stores/global';
import { useHistory, Link } from 'react-router-dom';
import { t } from '@/i18n';
import { isElectron } from '@/utils/platform';
import { LogManager } from '@/services/logs';

interface RoomProps {
  onConfirm: (type: string) => void
  onClose: (type: string) => void
  desc: string
  type: string
  url?: string
}

function RoomDialog(
{
  onConfirm,
  onClose,
  desc,
  type,
  url
}: RoomProps) {

  const handleClose = () => {
    onClose(type)
  };

  const handleConfirm = () => {
    onConfirm(type)
  }

  const getContent = () =>{       
    return (     
        <DialogContentText className="dialog-title">
          {desc}
        </DialogContentText>
    )
  }

  return (
    <div>
      <Dialog
        disableBackdropClick
        open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          className="modal-container"
        >
         {getContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const DialogContainer = () => {
  const history = useHistory();
  const {dialog} = useGlobalState();
  // @ts-ignore
  const ipc = window.ipc;

  const visible = useMemo(() => {
    if (!dialog.type) return false;
    return true;
  }, [dialog]);

  const onClose = (type: string) => {
    globalStore.removeDialog()    
    if(dialog.callBack){
      dialog.callBack(false);
    }
  }

  const onConfirm = async(type: string) => {        
    globalStore.removeDialog()      
    if(dialog.callBack){
      dialog.callBack(true);
    }
    return;
  }

  return (
    visible ? 
      <RoomDialog 
        type={dialog.type}
        desc={dialog.message}
        onClose={onClose}
        onConfirm={onConfirm}
        url={""}
      /> : 
      null
  )
}


export default React.memo(DialogContainer);