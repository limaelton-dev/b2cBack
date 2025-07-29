import { IsNumber } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class ProposalDto {
  @IsNumber()
  @IsNotEmpty()
  PRP_CODIGO: number;
}