-- Add delete_project_and_related_data function to handle cascading deletion
CREATE OR REPLACE FUNCTION public.delete_project_and_related_data(p_project_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- First remove any activities associated with this project
  DELETE FROM activities
  WHERE project_id = p_project_id;
  
  -- Remove project files from the database
  -- Note: The actual storage files need to be removed separately via the Storage API
  DELETE FROM project_files
  WHERE project_id = p_project_id;
  
  -- Remove all rooms
  DELETE FROM rooms
  WHERE project_id = p_project_id;
  
  -- Remove occupants
  DELETE FROM occupants
  WHERE project_id = p_project_id;
  
  -- Remove professionals
  DELETE FROM professionals
  WHERE project_id = p_project_id;
  
  -- Remove inspiration entries
  DELETE FROM inspiration_entries
  WHERE project_id = p_project_id;
  
  -- Remove project settings
  DELETE FROM project_settings
  WHERE project_id = p_project_id;
  
  -- Remove summaries
  DELETE FROM summaries
  WHERE project_id = p_project_id;
  
  -- Finally, remove the project itself
  DELETE FROM projects
  WHERE id = p_project_id;
  
  -- Note: we're using individual DELETE statements rather than relying on 
  -- cascading constraints to have more control and make it explicit what's being deleted
END;
$$;

-- Grant execution permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_project_and_related_data(UUID) TO authenticated;

-- Comment on function
COMMENT ON FUNCTION public.delete_project_and_related_data(UUID) IS 'Deletes a project and all related data in the correct order.'; 