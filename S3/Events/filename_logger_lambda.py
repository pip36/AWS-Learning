def handle_file_created_event(event, context):
    print("A new file was uploaded!")
    
    filename = event['Records'][0]["s3"]["object"]["key"]
    print("Filename: ", filename)

    return { 
        'filename' : filename
    }