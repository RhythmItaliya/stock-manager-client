import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DialogTableProps {
  title: string
  data: any[]
  headers: { key: string; title: string }[]
}

const DataDialog: React.FC<DialogTableProps> = ({ title, data, headers }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const openDialog = () => setIsDialogOpen(true)

  const renderCell = (cell: any) => {
    if (typeof cell === 'object' && cell !== null) {
      return JSON.stringify(cell)
    }
    return cell
  }

  return (
    <>
      <Button onClick={openDialog} variant='link'>
        {title}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header, index) => (
                    <TableHead key={index}>{header.title}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    {headers.map((header) => (
                      <TableCell key={header.key}>{renderCell(row[header.key])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DataDialog
