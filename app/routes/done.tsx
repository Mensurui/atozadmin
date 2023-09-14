import { Modal } from "~/components/modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
export default function Done(){
    return(
        <Modal isOpen={true}>
            <h1 className="text-9xl">Done</h1>
          <FontAwesomeIcon icon={faCircleCheck} fade size="10x" />
        </Modal>
        )
}